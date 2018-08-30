<?php

// 'At-Will Groups' source code
// (c) 2018 Ellie Hawk "@squeevee"

namespace Squeevee\AtWillGroups\Listener;

use Squeevee\AtWillGroups\Controllers\AtWillGroupsController;

use Flarum\Core\Group;
use Flarum\Api\Serializer\CurrentUserSerializer;
use Flarum\Event\ConfigureApiRoutes;
use Flarum\Event\PrepareApiAttributes;

use Illuminate\Support\Collection;
use Illuminate\Events\Dispatcher;

class AddAtWillGroupsApi
{
    public function subscribe(Dispatcher $events)
    {
        $events->listen(ConfigureApiRoutes::class, [$this, 'configureApiRoutes']);
        $events->listen(PrepareApiAttributes::class, [$this, 'prepareApiAttributes']);
    }

    public function configureApiRoutes(ConfigureApiRoutes $event)
    {
        $event->patch('/squeevee/at-will-groups', 'atWillGroups', AtWillGroupsController::class);
    }

    public function prepareApiAttributes(PrepareApiAttributes $event)
    {
        if ($event->isSerializer(CurrentUserSerializer::class)) {

            $groups = Group::get();
            $mayJoin = new Collection();
            $mayLeave = new Collection();

            foreach($groups as $group) {
                if($event->actor->can('squeevee.join_atWillGroup', $group))
                    $mayJoin->push(strval($group->id));
                if($event->actor->can('squeevee.leave_atWillGroup', $group))
                    $mayLeave->push(strval($group->id));
            };

            $event->attributes['atWillGroups'] = [
              'mayJoin' => $mayJoin,
              'mayLeave' => $mayLeave
            ];
        }
    }
}
