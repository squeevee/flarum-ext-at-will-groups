<?php

// 'At-Will Groups' source code
// (c) 2018 Ellie Hawk "@squeevee"

namespace Squeevee\AtWillGroups\Controllers;

use Flarum\Core\Group;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\ValidationException;
use Flarum\Http\Controller\ControllerInterface;

use Illuminate\Support\Collection;
use Psr\Http\Message\ServerRequestInterface;
use Zend\Diactoros\Response\EmptyResponse;


class AtWillGroupsController implements ControllerInterface
{
    use AssertPermissionTrait;

    public function handle(ServerRequestInterface $request)
    {
        $actor = $request->getAttribute('actor');
        $body = $request->getParsedBody();

        $join = $this->filterGroups(array_get($body, 'join'), $actor, true);
        $leave = $this->filterGroups(array_get($body, 'leave'), $actor, false);

        if (!$join->isEmpty())
            $actor->groups()->attach($join->toArray());
        if (!$leave->isEmpty())
            $actor->groups()->detach($leave->toArray());

        return new EmptyResponse(204);
    }

    private function filterGroups($id_strings, $actor, $join)
    {
        $result = new Collection();

        foreach ($id_strings as $id_string)
        {
            $id = (int)$id_string;
            $group = Group::find($id);

            $this->assertPermission($actor->can($join? 'squeevee.join_atWillGroup' : 'squeevee.leave_atWillGroup', $group));

            $result->push($id);
        }

        return $result;
    }
}
